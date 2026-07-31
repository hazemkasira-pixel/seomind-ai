from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from app.db.session import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    
    # معلومات العميل والهدف
    target_url = Column(String(255), nullable=True)  # رابط موقع العميل المستهدف
    
    # محتوى المقال
    title = Column(String(255), nullable=False)
    keyword = Column(String(100), index=True)
    content = Column(Text)
    seo_score = Column(Float, default=0.0)
    
    # الحالات الجديدة لدورة العمل الذكية (Autonomous Workflow)
    # analyzing: يقوم بتحليل المنافسين وكتابة المسودة
    # draft_ready: المسودة جاهزة وتنتظر موافقة العميل
    # approved: العميل وافق على المحتوى
    # published: تم النشر بنجاح في ووردبريس
    # error: حدث خطأ أثناء المعالجة
    status = Column(String(50), default="analyzing") 
    
    # ربط النتيجة بووردبريس
    wordpress_post_id = Column(Integer, nullable=True)  # يُحفظ هنا رقم المقال في ووردبريس بعد النشر
    
    # التواريخ
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())