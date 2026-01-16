import os
from google import genai
from typing import Optional

class AIService:
    @staticmethod
    async def chat(prompt: str, lang: str = 'cn') -> str:
        api_key = os.getenv("API_KEY")
        if not api_key:
            return "API Key not configured in backend."

        client = genai.Client(api_key=api_key)
        
        system_instructions = (
            "你是一个名为 WireExpert Pro AI 的电气工程专家。你的专长包括 IEC 60364 标准、"
            "电缆载流量计算、低压配电设计以及电缆生产规范。你需要以专业、严谨但简洁的风格回答用户。"
            f"请使用 {lang} 回答。始终将安全放在首位。如果用户询问非技术话题，请引导回电气工程。"
        )

        try:
            response = client.models.generate_content(
                model='gemini-3-flash-preview',
                contents=prompt,
                config={
                    "system_instruction": system_instructions,
                    "temperature": 0.7
                }
            )
            return response.text
        except Exception as e:
            print(f"AI Error: {e}")
            return "AI 服务暂时不可用，请稍后再试。"
