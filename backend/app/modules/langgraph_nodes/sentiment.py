"""
sentiment.py
------------
Performs sentiment analysis on cleaned article text using Groq's LLM.

This module:
    - Accepts pre-processed article text from the pipeline state.
    - Uses an LLM to classify sentiment as Positive, Negative, or Neutral.
    - Returns the sentiment label along with updated pipeline state.

Functions:
    run_sentiment_sdk(state: dict) -> dict:
        Analyzes sentiment and updates the state with the result.
"""


import os
import time
from groq import Groq
from dotenv import load_dotenv
from app.logging.logging_config import setup_logger

logger = setup_logger(__name__)

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def run_sentiment_sdk(state):
    try:
        text = state.get("cleaned_text")
        if not text:
            raise ValueError("Missing or empty 'cleaned_text' in state")

        # Retry logic for rate limit errors
        max_retries = 3
        for attempt in range(max_retries):
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a sentiment analysis assistant. "
                                "Only respond with one word:"
                                " Positive, Negative, or Neutral."
                            ),
                        },
                        {
                            "role": "user",
                            "content": (
                                f"Analyze the sentiment of the following text:\n\n{text}"
                            ),
                        },
                    ],
                    model="qwen/qwen3-32b",
                    temperature=0.2,
                    max_tokens=3,
                )
                break  # Success, exit retry loop
            except Exception as api_err:
                if "429" in str(api_err) or "rate_limit" in str(api_err).lower():
                    wait_time = (attempt + 1) * 5  # 5s, 10s, 15s
                    logger.warning(f"Rate limited. Waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                    time.sleep(wait_time)
                    if attempt == max_retries - 1:
                        raise  # Re-raise on last attempt
                else:
                    raise  # Re-raise non-rate-limit errors

        sentiment = chat_completion.choices[0].message.content.strip()
        sentiment = sentiment.lower()

        return {
            **state,
            "sentiment": sentiment,
            "status": "success",
        }

    except Exception as e:
        logger.exception(f"Error in sentiment_analysis: {e}")
        return {
            "status": "error",
            "error_from": "sentiment_analysis",
            "message": str(e),
        }


# if __name__ == "__main__":
#     dummy_state = {
#         "cleaned_text": (
#             "The 2025 French Open men’s final at Roland Garros was more than"
#             "just a sporting event."
#         )
#     }

#     result = run_sentiment_sdk(dummy_state)
#     print("Sentiment Output:", result)
