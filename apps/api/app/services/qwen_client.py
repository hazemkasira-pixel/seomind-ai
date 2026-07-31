import json
import requests
import re
from app.core.config import settings

OLLAMA_BASE_URL = "http://localhost:11434"

def analyze_seo_content(keyword: str, content: str) -> dict:
    user_prompt = f"""اكتب مقالاً حصرياً ومحسناً لمحركات البحث (SEO) باللغة العربية الفصحى 100% عن الكلمة المفتاحية: '{keyword}'.
تحذير أمني صارم: ممنوع تماماً استخدام أي حرف صيني أو إنجليزي أو أي لغة أخرى غير العربية.
المطلوب إرجاعه بصيغة JSON فقط تحتوي على المفاتيح التالية بالضبط:
1. "seo_score": رقم من 80 إلى 100.
2. "weaknesses": قائمة بـ 3 نقاط ضعف (بالعربية فقط).
3. "suggested_title": عنوان جذاب (بالعربية فقط).
4. "suggested_meta_description": وصف تعريفي (بالعربية فقط).
5. "full_content": مقال مختصر ومفيد (حوالي 300-400 كلمة) بتنسيق Markdown مثل ## للعناوين و - للقوائم (بالعربية الفصحى فقط)."""
    
    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": "qwen2.5:7b",
                "messages": [
                    {"role": "system", "content": "أنت كاتب محتوى عربي محترف وحصري. ممنوع تماماً استخدام أي حرف صيني أو إنجليزي أو أي لغة أخرى غير العربية الفصحى. يجب أن يكون كل حرف في ردك عربياً 100%."},
                    {"role": "user", "content": user_prompt}
                ],
                "stream": False,
                "format": "json"
            },
            timeout=300  # <--- تم زيادة الوقت إلى 5 دقائق (300 ثانية)
        )
        
        result = response.json()
        response_text = result["message"]["content"]
        
        # فلتر الأمان الذكي: إزالة أي أحرف صينية إذا تسربت بالخطأ
        response_text = re.sub(r'[\u4e00-\u9fff]+', ' [تم تصحيح نص غير عربي تلقائياً] ', response_text)
        
        start_idx = response_text.find("{")
        end_idx = response_text.rfind("}")
        
        if start_idx != -1 and end_idx != -1:
            clean_json_text = response_text[start_idx:end_idx+1]
            return json.loads(clean_json_text)
        else:
            return json.loads(response_text)
            
    except Exception as e:
        return {
            "error": str(e), 
            "seo_score": 0, 
            "weaknesses": ["استغرق النموذج وقتاً طويلاً، يرجى المحاولة مرة أخرى أو تقليل طول المقال"], 
            "suggested_title": "", 
            "suggested_meta_description": "",
            "full_content": ""
        }