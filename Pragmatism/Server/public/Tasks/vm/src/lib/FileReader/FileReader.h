#include <string>

class FileReader
{
public:
    FileReader(std::string filePath);

    std::string ReadFile();

private:
    std::string m_strFilePath;
};