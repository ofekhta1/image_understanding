from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings, ChatNVIDIA
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import chain
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
# Your existing imports and setup here
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings, ChatNVIDIA
load_dotenv()
os.environ['NVIDIA_API_KEY'] = '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'

# Initialize a web-based document loader and load the document
loader = WebBaseLoader(
    "https://developer.nvidia.com/blog/nvidia-nim-offers-optimized-inference-microservices-for-deploying-ai-models-at-scale/")
docs = loader.load()

# Initialize the NVIDIA Embeddings module
embeddings = NVIDIAEmbeddings()

# Initialize a text splitter to divide documents into smaller chunks with specified size and overlap
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300, chunk_overlap=30)

# Split the loaded documents into chunks
documents = text_splitter.split_documents(docs)

# Initialize a FAISS vector store from the document chunks and embeddings
try:
    vector = FAISS.from_documents(documents, embeddings)
    
except requests.exceptions.HTTPError as e:
    print("HTTP Error:", e)
    print("Response status code:", e.response.status_code)
    print("Response body:", e.response.text)
except Exception as e:
    print("An error occurred:", str(e))

# Convert the vector store into a retriever for searching documents
retriever = vector.as_retriever()

# Initialize the ChatNVIDIA model with a specified model version
model = ChatNVIDIA(model="mistral_7b")

# Define a template for generating hypothetical answers to questions
hyde_template = """Generate a one-paragraph hypothetical answer to the below question:
{question}"""

# Initialize a prompt template from the hypothetical answer template
hyde_prompt = ChatPromptTemplate.from_template(hyde_template)

# Chain the prompt template with the model and a string output parser to form a query transformer
hyde_query_transformer = hyde_prompt | model | StrOutputParser()

# Define a chainable function to generate hypothetical documents based on a question!


@chain
def hyde_retriever(question):
    hypothetical_document = hyde_query_transformer.invoke(
        {"question": question})
    return retriever.invoke(hypothetical_document)


# Define a template for answering questions based on provided context
template = """Answer the question strictly based on the following context:
{context}

Question: {question}
"""

# Initialize a prompt template from the answer template
prompt = ChatPromptTemplate.from_template(template)

# Chain the prompt template with the model and a string output parser to form an answer chain
answer_chain = prompt | model | StrOutputParser()

# Define a chainable function that generates answers based on a question and context


@chain
def final_chain(question):
    # Retrieve documents using the hyde_retriever
    documents = hyde_retriever.invoke(question)
    for s in answer_chain.stream({"question": question, "context": documents}):
        yield s


# for s in final_chain.stream("give me five things to know about lions"):
#     print(s, end="")

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains


@app.route('/query', methods=['POST'])
def query():
    question = request.json.get('question')
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Assuming `final_chain` is your method that processes the question
    # Let's call it and get the response
    try:
        response = ""
        for s in final_chain.stream(question):
            response += s
        return jsonify({"answer": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
