import requests
from requests.auth import HTTPBasicAuth
from app.core.config import settings

def publish_to_wordpress(article_id: int, title: str, content: str) -> dict:
    """دالة لنشر المقال في ووردبريس"""
    
    # إذا لم تكن الإعدادات مملوءة، نرجع محاكاة نجاح للتجربة
    if not settings.WORDPRESS_URL or not settings.WORDPRESS_USER:
        return {
            "success": True,
            "wp_post_id": 999, # رقم وهمي للتجربة
            "message": "تمت المحاكاة بنجاح! (لم يتم النشر الفعلي لعدم وجود إعدادات ووردبريس)"
        }

    url = f"{settings.WORDPRESS_URL.rstrip('/')}/wp-json/wp/v2/posts"
    
    payload = {
        "title": title,
        "content": content,
        "status": "draft" # ننشره كمسودة أولاً لمراجعته يدوياً في ووردبريس
    }
    
    try:
        response = requests.post(
            url,
            json=payload,
            auth=HTTPBasicAuth(settings.WORDPRESS_USER, settings.WORDPRESS_APP_PASSWORD),
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            wp_data = response.json()
            return {
                "success": True,
                "wp_post_id": wp_data.get("id"),
                "message": "تم نشر المقال في ووردبريس بنجاح كمسودة!"
            }
        else:
            return {
                "success": False,
                "error": response.text
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }