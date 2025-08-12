#pragma once

#ifdef Linux
#define _In_
#define _Out_
#define _Inout_
#define _In_opt_
#define _Out_opt_
#define _In_reads_(x)
#define _Out_writes_(x)
#define _In_z_
#define _Out_z_
#define _Outptr_
#else
#include <sal.h>
#endif