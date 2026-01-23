"""
web_search.py
-------------
Provides a simple wrapper for performing web search queries using Tavily API.

Tavily is a search API optimized for AI/LLM applications and fact-checking.
Free tier: 1,000 queries/month (no IP rate limiting issues).

This module:
    - Loads the Tavily API key from environment variables.
    - Sends search requests to the Tavily Search API.
    - Returns search results with title, link, and snippet.

Functions:
    search_google(query: str) -> list[dict]:
        Executes a Tavily search for the given query and returns the top result
        in a list containing its title, link, and snippet.

Environment Variables:
    TAVILY_API_KEY (str): API key for Tavily Search API.
    Get your free API key at: https://tavily.com
"""

import requests
from dotenv import load_dotenv
import os
from app.logging.logging_config import setup_logger

load_dotenv()

logger = setup_logger(__name__)

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


def search_google(query):
    """
    Search using Tavily API (kept function name for compatibility).
    Tavily is optimized for AI/LLM fact-checking with 1,000 free queries/month.
    """
    if not TAVILY_API_KEY:
        logger.error("TAVILY_API_KEY not set in environment variables")
        return []
    
    try:
        response = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": TAVILY_API_KEY,
                "query": query,
                "search_depth": "basic",
                "max_results": 3,
                "include_answer": False,
            },
            timeout=15
        )
        response.raise_for_status()
        data = response.json()
        
        results = data.get("results", [])
        if not results:
            logger.warning(f"No search results found for query: {query[:50]}...")
            return []
        
        # Return first result only (same format as original Google implementation)
        first_item = results[0]
        first = {
            "title": first_item.get("title", "No title"),
            "link": first_item.get("url", ""),
            "snippet": first_item.get("content", "No snippet available"),
        }
        
        logger.info(f"✅ Found result: {first['title']}")
        return [first]
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error during Tavily search: {e}")
        return []
    except Exception as e:
        logger.error(f"Error parsing Tavily search response: {e}")
        return []
