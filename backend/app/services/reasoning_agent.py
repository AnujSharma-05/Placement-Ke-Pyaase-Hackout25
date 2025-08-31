import os
from crewai import Agent, Task, Crew, Process
# from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv


from crewai import LLM

# Load environment variables from .env file
load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")

# Initialize the Gemini LLM
# This will automatically use the GOOGLE_API_KEY from your .env file
# llm = ChatGoogleGenerativeAI(
#     model="gemini-pro",
#     verbose=True,
#     temperature=0.5,
#     google_api_key=os.environ.get("GOOGLE_API_KEY")
# )

"""using crewai's inbuilt llm class which is independent of langchain dependecy"""
"""also check the extra parameters we can add to improve the model's response"""
llm = LLM(
    model="gemini/gemini-2.0-flash",
    temperature=1,
    # reasoning_effort='high'
)


# Define the Agent
analyst_agent = Agent(
    role="Green Hydrogen Feasibility Analyst",
    goal="To provide clear, data-driven reasoning for the feasibility score of a potential Green Hydrogen project location in India.",
    backstory=(
        "You are a world-class energy sector analyst with expertise in India's renewable energy landscape. "
        "You specialize in breaking down complex quantitative data into concise, qualitative insights for investors and policymakers. "
        "Your analysis is always objective and directly tied to the data provided."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

# # --- AGENT 1: The Existing Lead Analyst ---
# analyst_agent = Agent(
#     role="Green Hydrogen Feasibility Analyst",
#     # ... (rest of the definition is unchanged)
#     goal="To provide a clear, data-driven reasoning for the feasibility of a potential Green Hydrogen project location in India, combining power supply data and financial estimates.",
#     # ...
# )

# --- AGENT 2: The New Financial Specialist ---
financial_analyst_agent = Agent(
    role="Financial Analyst for Green Energy Projects",
    goal="To estimate the preliminary Capital Expenditure (CAPEX) and annual Operational Expenditure (OPEX) for a proposed Green Hydrogen project (in Indian Rupee).",
    backstory=(
        "You are a meticulous financial analyst with deep experience in cost modeling for renewable energy infrastructure in India. "
        "You provide high-level, indicative cost estimates to guide initial investment decisions. "
        "You work with industry-standard heuristics to calculate CAPEX and OPEX based on project size (MW)."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

def get_reasoning_for_data(weights, scores_data):
    """
    Uses the CrewAI agent to generate a textual reasoning for the given scores.
    
    Args:
        weights (dict): The user's input weights.
        scores_data (dict): The output data from the optimization service.
        
    Returns:
        str: The AI-generated reasoning.
    """
    
    # Dynamically create the task description based on the input data
    task_description = (
        f"Analyze the following data for a potential Green Hydrogen project location in India and provide a concise reasoning for its feasibility. "
        f"The user's priorities (weights) are: Power Proximity = {weights.get('power', 0)}, Market Proximity = {weights.get('market', 0)}, Logistics Access = {weights.get('logistics', 0)}. "
        f"The calculated feasibility scores (out of 10) are: Overall Score = {scores_data.get('overallScore', 'N/A')}, "
        f"Power Score = {scores_data.get('subScores', {}).get('power', 'N/A')}, "
        f"Market Score = {scores_data.get('subScores', {}).get('market', 'N/A')}, "
        f"Logistics Score = {scores_data.get('subScores', {}).get('logistics', 'N/A')}. "
        f"Explain WHY the overall score is what it is, referencing the user's weights and the specific sub-scores. "
        f"For example, if the power score is high and the user weighted power heavily, mention that as a key strength. "
        f"Keep the analysis to 2-3 sentences."
    )

    # Define the Task for the Agent
    analysis_task = Task(
        description=task_description,
        expected_output="A short, insightful paragraph explaining the reasoning behind the scores, directly referencing the provided data and user weights.",
        agent=analyst_agent
    )

    # Create and run the Crew
    # Adding extra agent here to get cost
    crew = Crew(
        agents=[analyst_agent, financial_analyst_agent],
        tasks=[analysis_task],
        verbose=True,
        process=Process.sequential
    )

    print(gemini_api_key)
    result = crew.kickoff()
    return result.raw


def get_reasoning_for_power_supply(power_analysis_data):
    """
    Uses a multi-agent Crew to generate a comprehensive report including
    power supply analysis and financial estimates (CAPEX/OPEX).
    """
    required_capacity = power_analysis_data.get('required_capacity_mw', 0)

    # --- TASK 1: Financial Estimation ---
    # The Financial Analyst calculates the costs first.
    financial_task = Task(
        description=(
            f"Calculate the preliminary financial estimates for a Green Hydrogen project "
            f"that requires {required_capacity} MW of power. "
            f"1.  **Estimate Capital Expenditure (CAPEX):** Use a standard heuristic of **$1.5 million USD per MW** for the electrolyzer system and balance-of-plant costs. Calculate the total. "
            f"2.  **Estimate Annual Operational Expenditure (OPEX):** Assume OPEX is **3% of the total CAPEX** per year. Calculate the total. "
            f"Present the final numbers clearly under 'Capital Expenditure (CAPEX)' and 'Annual Operational Expenditure (OPEX)' headings."
        ),
        expected_output="A concise summary with the total estimated CAPEX in USD and the total estimated annual OPEX in USD.",
        agent=financial_analyst_agent
    )

    # --- TASK 2: Final Report Synthesis ---
    # The Lead Analyst takes the power data AND the financial data to write the final report.
    
    plants_summary = "\n".join([
        f"- A {plant['type']} source with {plant['capacity_mw']} MW is {plant['distance_km']} km away."
        for plant in power_analysis_data.get("nearest_plants", [])
    ])

    synthesis_task = Task(
        description=(
            f"Create a comprehensive feasibility report for a proposed Green Hydrogen project. "
            f"You must synthesize two sets of information: the Power Supply data and the Financial Estimates. "
            f"\n\n**1. Power Supply Data:**"
            f"\nThe project requires {required_capacity} MW. The total available capacity from nearby plants is {power_analysis_data.get('total_available_capacity_mw')} MW, "
            f"resulting in a Supply Score of {power_analysis_data.get('supply_score')}/10. The nearest plants are:\n{plants_summary}"
            f"\n\n**2. Financial Estimates (from the Financial Analyst):**"
            f"\nIncorporate the CAPEX and OPEX calculations from the Financial Analyst's report. "
            f"\n\n**Your Final Report Structure:**"
            f"\nStructure your output with three distinct sections using Markdown headings:"
            f"\n### Power Supply Analysis"
            f"\n(Provide a 2-3 sentence analysis of the power supply adequacy.)"
            f"\n### Financial Estimate"
            f"\n(State the CAPEX and annual OPEX clearly.)"
            f"\n### Overall Recommendation"
            f"\n(Provide a 1-2 sentence concluding thought on the project's viability based on both power and cost factors.)"
        ),
        expected_output="A structured report with three markdown-headed sections: 'Power Supply Analysis', 'Financial Estimate', and 'Overall Recommendation'.",
        agent=analyst_agent,
        context=[financial_task] # <-- CRITICAL: This gives the output of Task 1 to Task 2
    )

    # Create and run the Crew with both agents and tasks
    crew = Crew(
        agents=[analyst_agent, financial_analyst_agent],
        tasks=[financial_task, synthesis_task],
        verbose=True,
        # Process.sequential ensures tasks run one after another
        process=Process.sequential 
    )

    result = crew.kickoff()
    return result.raw