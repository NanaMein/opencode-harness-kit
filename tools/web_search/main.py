import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq, GroqError
from groq.resources.chat.completions import ChatCompletion

env_path = Path(__file__).resolve().parent.parent.parent / ".env"

load_dotenv(env_path)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
if not client:
    raise ValueError("GROQ_API_KEY not set")


def search(query: str) -> str | None:
    completion: ChatCompletion = client.chat.completions.create(
        model="groq/compound",
        messages=[
          {
            "role": "user",
            "content": query
          }
        ],
        temperature=0.5,
        max_completion_tokens=8192,
        top_p=1,
        compound_custom={"tools":{"enabled_tools":["web_search", "visit_website", ]}}
    )
    return completion.choices[0].message.content

def main():
    # Check if a prompt/query was passed via the terminal
    if len(sys.argv) < 2:
        print("Usage: python tools/web_search/main.py \"Your search query here\"", file=sys.stderr)
        sys.exit(1)

    # Combine all arguments after the script name into a single query string
    query = " ".join(sys.argv[1:])

    try:
        # Print logs/status to stderr so they don't pollute the final output text
        print("Executing web search tool for query by LLM...", file=sys.stderr)

        result = search(query)

        if result:
            # Print the clean final response to stdout for the agent
            print(result)
        else:
            print("Error: Received an empty response from the model.", file=sys.stderr)
            sys.exit(1)

    except GroqError as ge:
        print(f"An error occurred during execution: {ge}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
