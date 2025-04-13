import torch
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import GoCodeTextSplitter

# Initialize the SentenceTransformerEmbeddings
embedding_model = SentenceTransformerEmbeddings(
    model_name="Salesforce/codet5p-220m",  # changed for code embeddings
    model_kwargs={"device": "cuda" if torch.cuda.is_available() else "cpu"}
)

# Initialize the GoCodeSplitter
go_splitter = GoCodeTextSplitter(
    chunk_size=1000,
    chunk_overlap=100,
    keep_separator=True,
)

def utf8_loader(file_path):
    return TextLoader(file_path, encoding='utf-8')


# Set the directory containing Go code (update this path as needed)
code_dir = r'C:\\KarthikWorkSpace\\GitRepos\\ProjectsMonoRepo\\Pragmatism\\Server'

loader = DirectoryLoader(
    path=code_dir,
    glob="**/*.go",
    loader_cls=utf8_loader,
    recursive=True
)
documents = loader.load()
split_docs = go_splitter.split_documents(documents)

    
# Initialize the Chroma vector store and add documents (ensure proper configuration of Chroma)
vectorstore = Chroma.from_documents(documents=split_docs, embedding=embedding_model, persist_directory="./vector_embeddings")



results=vectorstore.similarity_search_with_score("Where is oauth authorization code shared and access token exchanged")
print(results)

