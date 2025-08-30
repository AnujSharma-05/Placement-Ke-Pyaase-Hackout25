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
    crew = Crew(
        agents=[analyst_agent],
        tasks=[analysis_task],
        verbose=True,
        process=Process.sequential
    )

    print(gemini_api_key)
    result = crew.kickoff()
    return result.raw


def get_reasoning_for_power_supply(power_analysis_data):
    """
    Uses the CrewAI agent to generate reasoning based on a detailed power supply analysis.
    """
    # Create a more detailed, readable summary of the nearest plants
    plants_summary = "\n".join([
        f"- A {plant['type']} source in {plant['State']} with {plant['capacity_mw']} MW capacity is {plant['distance_km']} km away."
        for plant in power_analysis_data.get("nearest_plants", [])
    ])

    task_description = (
        f"Analyze the green power supply for a potential hydrogen project. "
        f"The project requires {power_analysis_data.get('required_capacity_mw')} MW of power. "
        f"Our analysis found a total of {power_analysis_data.get('total_available_capacity_mw')} MW available from the nearest plants, resulting in a 'Supply Score' of {power_analysis_data.get('supply_score')}/10. "
        f"The key nearby power sources are:\n{plants_summary}\n\n"
        f"Based on this data, provide a 2-3 sentence analysis. "
        f"Does the available capacity meet the project's requirements? "
        f"Comment on the strength of the power supply. Is it abundant, sufficient, or insufficient? "
        f"Mention the proximity of the plants as a key factor."
    )

    analysis_task = Task(
        description=task_description,
        expected_output="A short, insightful paragraph analyzing the power supply adequacy for the project, referencing the required vs. available capacity.",
        agent=analyst_agent
    )

    crew = Crew(agents=[analyst_agent], tasks=[analysis_task], verbose=True)
    result = crew.kickoff()
    return result.raw