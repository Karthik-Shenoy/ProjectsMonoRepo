#include "./OpCodes.h"
#include <vector>

struct Operation {
    OpCode opCode;
    std::vector<int> vecArgs;
};