#pragma once
#include <string>
#include <vector>

namespace StringUtils
{
    std::vector<std::string> stringSplit(std::string str, char cCh)
    {
        if(str.empty())
        {
            return {};
        }
        std::vector<std::string> ret;
        std::string strCurrElement = "";

        const char *szStr = str.c_str();

        for (int i = 0; i <= str.length(); i++)
        {
            if (szStr[i] == cCh || szStr[i] == '\0')
            {
                ret.push_back(strCurrElement);
                strCurrElement = "";
                continue;
            }
            strCurrElement += szStr[i];
        }

        return ret;
    }
}