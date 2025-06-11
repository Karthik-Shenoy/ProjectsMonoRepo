#pragma once
#include <string>

#include "../Operations/Operation.h"
#include "../Result/Result.h"
#include "../ExternLibWrappers/SalWrapper.h"
#include "../Utils/StringUtils.h"

namespace Parser
{
    Result Parse(_In_ std::string strCode, _Out_ std::vector<Operation> &vecOperations)
    {
        // split code into lines
        std::vector<std::string> lines = StringUtils::stringSplit(strCode, '\n');
        for (const auto &line : lines)
        {
            // skip empty lines
            if (line.empty())
            {
                continue;
            }

            // parse operation
            Operation op;
            Result res = ParseOp(line, op);
            if (res != Result::Success)
            {
                return res; // return on failure
            }

            // add operation to vector
            vecOperations.push_back(op);
        }
        return Result::Success;
    }

    Result ParseOp(_In_ std::string strLine, _Out_ Operation &op)
    {
        std::vector<std::string> vecOpTokens = StringUtils::stringSplit(strLine, ' ');
        if (vecOpTokens.size() < 2)
        {
            return Result::ParseFailure;
        }

        std::string strOperation = vecOpTokens[0];
        std::vector<std::string> vecstrArgs = StringUtils::stringSplit(vecOpTokens[1], ',');

        if(!)
    }

};