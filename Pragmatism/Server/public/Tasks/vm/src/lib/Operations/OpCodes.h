#include <unordered_map>
#include <string>

enum class OpCode
{
    MOV = 0,
    LDR = 1,
    STR = 2,
    ADD = 3,
};

static std::unordered_map<std::string, OpCode> mapOpCodes;

static void InitializeOpCodes()
{
    mapOpCodes["ADD"] = OpCode::ADD;
    mapOpCodes["LDR"] = OpCode::LDR;
    mapOpCodes["STR"] = OpCode::STR;
    mapOpCodes["MOV"] = OpCode::MOV;
}
