from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional

from app.db.session import get_db
from app.models.article import Article
from app.services.qwen_client import analyze_seo_content
from app.services.wordpress_publisher import publish_to_wordpress  # <-- تمت الإضافة

router = APIRouter(prefix="/articles", tags=["articles"])

class ArticleCreate(BaseModel):
    keyword: str = Field(..., description="الكلمة المفتاحية المستهدفة (إلزامي)")
    target_url: Optional[str] = Field(default=None, description="رابط موقع العميل (اختياري)")
    title: Optional[str] = Field(default=None, description="العنوان (اختياري)")
    content: Optional[str] = Field(default=None, description="المحتوى المبدئي (اختياري)")

@router.post("/analyze")
async def analyze_article(article_data: ArticleCreate, db: Session = Depends(get_db)):
    """تحليل وكتابة مقال تلقائي كامل باستخدام Qwen AI"""
    
    # 1. حفظ المقال في قاعدة البيانات كـ "قيد التحليل"
    new_article = Article(
        target_url=article_data.target_url,
        title=article_data.title or "قيد الكتابة بواسطة الذكاء الاصطناعي...",
        keyword=article_data.keyword,
        content=article_data.content or "",
        status="analyzing"
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    # 2. إرسال الطلب إلى Qwen للكتابة الشاملة
    content_to_analyze = article_data.content or f"اكتب مقالاً شاملاً ومحسناً لمحركات البحث (SEO) عن: {article_data.keyword}"
    
    analysis_result = analyze_seo_content(
        keyword=article_data.keyword,
        content=content_to_analyze
    )
    
    # 3. تحديث المقال بنتيجة التحليل والكتابة الكاملة
    if "error" not in analysis_result:
        new_article.seo_score = analysis_result.get("seo_score", 0)
        
        if not article_data.title:
            new_article.title = analysis_result.get("suggested_title", new_article.title)
            
        if not article_data.content:
            new_article.content = analysis_result.get("full_content", "")
            
        new_article.status = "draft_ready" 
    else:
        new_article.status = "error"
    
    db.commit()
    db.refresh(new_article)
    
    return {
        "article_id": new_article.id,
        "status": new_article.status,
        "seo_score": new_article.seo_score,
        "analysis": analysis_result
    }

@router.get("/")
async def get_all_articles(db: Session = Depends(get_db)):
    articles = db.query(Article).all()
    return articles

@router.get("/{article_id}")
async def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

# ---------------------------------------------------------
# 🚀 المسار الجديد: نشر المقال في ووردبريس
# ---------------------------------------------------------
@router.post("/{article_id}/publish")
async def publish_article(article_id: int, db: Session = Depends(get_db)):
    """نشر مقال معتمد في ووردبريس"""
    
    # 1. جلب المقال من قاعدة البيانات
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article.status != "draft_ready":
        raise HTTPException(status_code=400, detail="يجب أن يكون المقال في حالة 'draft_ready' ليتم نشره")

    # 2. استدعاء دالة النشر
    publish_result = publish_to_wordpress(
        article_id=article.id,
        title=article.title,
        content=article.content
    )
    
    # 3. تحديث حالة المقال بناءً على نتيجة النشر
    if publish_result["success"]:
        article.status = "published"
        article.wordpress_post_id = publish_result.get("wp_post_id")
        db.commit()
        
        return {
            "message": publish_result["message"],
            "article_id": article.id,
            "wordpress_post_id": article.wordpress_post_id,
            "status": article.status
        }
    else:
        article.status = "error"
        db.commit()
        raise HTTPException(status_code=500, detail=f"فشل النشر: {publish_result['error']}")