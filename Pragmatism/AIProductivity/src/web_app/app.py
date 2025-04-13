import streamlit as st
import torch
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
import torch


torch.classes.__path__ = []  # Prevent Streamlit from trying to inspect torch.classes

st.title("Code Reasearch Assistant")

query = st.text_input("Enter your query:")

if query:
    # Initialize the SentenceTransformerEmbeddings
    embedding_model = SentenceTransformerEmbeddings(
        model_name="Salesforce/codet5p-220m",  # changed for code embeddings
        model_kwargs={"device": "cuda" if torch.cuda.is_available() else "cpu"}
    )
  
    # Load the persisted Chroma vector store; adjust path if needed
    vectorstore = Chroma(
        persist_directory="./embeddings/vector_embeddings",
        embedding_function=embedding_model
    )
    
    results = vectorstore.similarity_search_with_score(query)
    st.write(results)