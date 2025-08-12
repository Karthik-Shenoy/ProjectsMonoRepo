#define BOOST_TEST_MODULE StringUtilsTest
#include <boost/test/included/unit_test.hpp>
#include "../StringUtils.h"

BOOST_AUTO_TEST_SUITE(StringUtilsTests)

// empty input yields empty vector
BOOST_AUTO_TEST_CASE(EmptyInput)
{
    auto r = StringUtils::stringSplit("", ',');
    BOOST_TEST(r.empty());
}

// no delimiter present => one element equal to whole string
BOOST_AUTO_TEST_CASE(NoDelimiter)
{
    auto r = StringUtils::stringSplit("abcdef", ',');
    BOOST_REQUIRE_EQUAL(r.size(), 1);
    BOOST_TEST(r[0] == "abcdef");
}

// delimiter at start and end produces empty string elements
BOOST_AUTO_TEST_CASE(LeadingAndTrailingDelimiters)
{
    auto r = StringUtils::stringSplit(",abc,def,", ',');
    BOOST_REQUIRE_EQUAL(r.size(), 4);
    BOOST_TEST(r[0].empty());
    BOOST_TEST(r[1] == "abc");
    BOOST_TEST(r[2] == "def");
    BOOST_TEST(r[3].empty());
}

// consecutive delimiters produce empty elements between them
BOOST_AUTO_TEST_CASE(ConsecutiveDelimiters)
{
    auto r = StringUtils::stringSplit("a,,b,,,c", ',');
    std::vector<std::string> exp = { "a", "", "b", "", "", "c" };
    BOOST_REQUIRE_EQUAL(r.size(), exp.size());
    for (size_t i = 0; i < exp.size(); ++i)
        BOOST_TEST(r[i] == exp[i]);
}
// test splitting a string with only a delimiter
BOOST_AUTO_TEST_CASE(OnlyDelimiter)
{
    auto r = StringUtils::stringSplit(",", ',');
    BOOST_REQUIRE_EQUAL(r.size(), 2);
    BOOST_TEST(r[0].empty());
    BOOST_TEST(r[1].empty());
}

// test splitting a string with multiple delimiters only
BOOST_AUTO_TEST_CASE(OnlyDelimiters)
{
    auto r = StringUtils::stringSplit(",,,", ',');
    BOOST_REQUIRE_EQUAL(r.size(), 4);
    BOOST_TEST(r[0].empty());
    BOOST_TEST(r[1].empty());
    BOOST_TEST(r[2].empty());
    BOOST_TEST(r[3].empty());
}

// test splitting a string with spaces as delimiter
BOOST_AUTO_TEST_CASE(SpaceDelimiter)
{
    auto r = StringUtils::stringSplit("a b  c ", ' ');
    std::vector<std::string> exp = { "a", "b", "", "c", "" };
    BOOST_REQUIRE_EQUAL(r.size(), exp.size());
    for (size_t i = 0; i < exp.size(); ++i)
        BOOST_TEST(r[i] == exp[i]);
}

// test splitting a string with no content between delimiters
BOOST_AUTO_TEST_CASE(AllEmptyBetweenDelimiters)
{
    auto r = StringUtils::stringSplit(",,", ',');
    BOOST_REQUIRE_EQUAL(r.size(), 3);
    BOOST_TEST(r[0].empty());
    BOOST_TEST(r[1].empty());
    BOOST_TEST(r[2].empty());
}

// test splitting a string with a single character
BOOST_AUTO_TEST_CASE(SingleCharacter)
{
    auto r = StringUtils::stringSplit("x", ',');
    BOOST_REQUIRE_EQUAL(r.size(), 1);
    BOOST_TEST(r[0] == "x");
}

// normal split on spaces
BOOST_AUTO_TEST_CASE(NormalSplit)
{
    auto r = StringUtils::stringSplit("one two three", ' ');
    std::vector<std::string> exp = { "one", "two", "three" };
    BOOST_REQUIRE_EQUAL(r.size(), exp.size());
    for (size_t i = 0; i < exp.size(); ++i)
        BOOST_TEST(r[i] == exp[i]);
}

BOOST_AUTO_TEST_SUITE_END()