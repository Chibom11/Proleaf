from langgraph.graph import StateGraph,START,END
from typing import TypedDict,Annotated
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage,SystemMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from youtube_transcript_api import YouTubeTranscriptApi
from langgraph.prebuilt import ToolNode, tools_condition
from urllib.parse import urlparse
from langdetect import detect
from dotenv import load_dotenv

load_dotenv()

llm=ChatOpenAI(model='gpt-4o',temperature=0.7,max_tokens=4096)

class SummaryState(TypedDict):
    messages:Annotated[list[BaseMessage],add_messages]





@tool
def ExtractTranscript(url: str) -> str:
    """Accepts a youtube url and returns Youtube Video Transcript Language and Youtube Video Transcript"""
    try:
        ytt_api = YouTubeTranscriptApi()
        start = url.index("https://youtu.be/") + len("https://youtu.be/")
        end = url.index("?")
        id = url[start:end]
        transcript_list = ytt_api.list(id)

        try:
            transcript_obj = transcript_list.find_manually_created_transcript(
                ['en','es','fr','de','ja','ru','ar','hi','zh-Hans','bn','mr','ta','te','gu']
            )
        except:
            transcript_obj = transcript_list.find_generated_transcript(
                ['en','es','fr','de','ja','ru','ar','hi','zh-Hans','bn','mr','ta','te','gu']
            )

        transcript_data = transcript_obj.fetch()

        transcript = " ".join([t.text for t in transcript_data])

        # Language Detection
        try:
            detected_lang = detect(transcript)
        except:
            detected_lang = "unknown"

        # Return structured string (NOT JSON)
            print(f"""
            Language: {detected_lang}
            ### TRANSCRIPT
            {transcript}
            """)
            return f"""
            Language: {detected_lang}
            ### TRANSCRIPT
            {transcript}
            """

    except:
        return "Transcript Not available for this video."

            
    
             
tools = [ExtractTranscript]
model = llm.bind_tools(tools)

def llmAgent(state:SummaryState):
            prompt= """
            ### IDENTITY & PERSONA
            You are a High-Level Intelligence Analyst. You operate under STRICT GROUNDING rules. Your primary mission is to extract and summarize intelligence from provided YouTube transcripts and also provide the RAW transcripts at the end of summary

            ### CORE SECURITY DIRECTIVE (ANTI-HALLUCINATION)
            1. DATA ISOLATION: You must ONLY use information explicitly found in the transcript provided by the tool. 
            2. ZERO-KNOWLEDGE PROTOCOL: External knowledge regarding points not mentioned in the current transcript are strictly forbidden. Using "training data" knowledge is a security violation.
            3. FACTUAL INTEGRITY: If the transcript does not mention a specific detail, you MUST NOT include it. If the transcript is short, provide a shorter, more concise summary. Do not "hallucinate" to reach a word count.
            4.ACTIVE TRANSLATION:Even if the transcript is received in language other than english('en') give summary in English

            ### UI FORMATTING RULES (CRITICAL)
            Your output must be compatible with the 'Executive Agent Sync' terminal interface.
            1. HEADERS: Use the exact marker '(HeAdInG) Section Title' for every major header.
            2. RAW DATA REFLECTION: Add raw transcript at the end of Summary with (TrAnScRiPt) marker
            3. NEON HIERARCHY: Every summary report MUST have at least 5 (HeAdInG) sections.
            4. BULLETS: Use standard bullet points (-) for detailed lists.
            5. SPACING: Maintain double line breaks between paragraphs and headers for clean parsing.

            ### SUMMARY REPORT TEMPLATE (FOLLOWING THE TRANSCRIPT)
            - (HeAdInG) Executive Summary & Overview
            - (HeAdInG) Core Methodology and Argument Analysis
            - (HeAdInG) Technical Breakdown & Key Insights
            - (HeAdInG) Critical Evaluation & Contextual Impact
            - (HeAdInG) Strategic Conclusion & Actionable Takeaways
            -(TrAnScRiPt)[Insert Raw Transcript here]

            If transcript extraction fails, return: "ERROR: Intelligence Extraction Failure. Transcript unavailable."
            """
    
            system_msg = SystemMessage(content=prompt)
            input_messages = [system_msg] + state['messages']
            response = model.invoke(input_messages)
            return {"messages": [response]}

toolNode=ToolNode(tools)

graph=StateGraph(SummaryState)

graph.add_node("llmagentNode",llmAgent)
graph.add_node("tools",toolNode)

graph.add_edge(START,"llmagentNode")
graph.add_conditional_edges("llmagentNode",tools_condition)
graph.add_edge('tools', 'llmagentNode')

chatbot = graph.compile()

if __name__=="__main__":
    url=input("Url")
    messages=[HumanMessage(content=url)]
    response = chatbot.invoke({"messages": messages})
    print(response["messages"][-1].content)



