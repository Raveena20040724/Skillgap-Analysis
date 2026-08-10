import json
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

GROK_API_URL = "https://api.x.ai/v1/chat/completions"

class GrokClient:
    """Dedicated xAI Grok API client."""
    def __init__(self, api_key=None):
        self.api_key = api_key or getattr(settings, 'XAI_API_KEY', '')

    def call_grok(self, prompt, system_prompt="You are an expert AI Career and Skill Analysis Assistant. Always return strict, valid JSON without extra markdown formatting."):
        if not self.api_key or self.api_key == "your_grok_api_key_here" or "placeholder" in self.api_key:
            logger.warning("XAI_API_KEY is not configured. Returning fallback structured data.")
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "grok-beta",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(GROK_API_URL, headers=headers, json=payload, timeout=20)
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                # Clean up any potential markdown backticks
                if "```" in content:
                    content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
            else:
                logger.error(f"Grok API error status {response.status_code}: {response.text}")
                return None
        except requests.exceptions.Timeout:
            logger.error("Grok API request timed out.")
            return None
        except Exception as e:
            logger.error(f"Grok API call exception: {str(e)}")
            return None
