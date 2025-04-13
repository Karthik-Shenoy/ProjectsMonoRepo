--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-04-14 00:52:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24626)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    num_solves integer NOT NULL,
    markdown_url text,
    task_dir text
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24625)
-- Name: problems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.problems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.problems_id_seq OWNER TO postgres;

--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 215
-- Name: problems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.problems_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 219 (class 1259 OID 24676)
-- Name: solved_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solved_tasks (
    userid text,
    taskid integer,
    solution text,
    solved_at date
);


ALTER TABLE public.solved_tasks OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24634)
-- Name: task_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_files (
    task_id integer,
    file_name text,
    file_type integer
);


ALTER TABLE public.task_files OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24649)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text,
    solves integer,
    picture text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4700 (class 2604 OID 24629)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.problems_id_seq'::regclass);


--
-- TOC entry 4857 (class 0 OID 24676)
-- Dependencies: 219
-- Data for Name: solved_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solved_tasks (userid, taskid, solution, solved_at) FROM stdin;
103094514328351734590	1		2025-04-13
\.


--
-- TOC entry 4855 (class 0 OID 24634)
-- Dependencies: 217
-- Data for Name: task_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_files (task_id, file_name, file_type) FROM stdin;
1	loadbalancer.ts	1
1	contracts.ts	0
\.


--
-- TOC entry 4854 (class 0 OID 24626)
-- Dependencies: 216
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, num_solves, markdown_url, task_dir) FROM stdin;
1	Load balancing, load balancers!	Modern distributed applications require dynamic scaling to handle variable workloads efficiently. implement automatic scaling with service discovery mechanisms, continuous configuration updates, and intelligent load balancing to ensure maximum reliability and optimal resource utilization during traffic fluctuations.	0	/PROBLEMS/LBLBS	lblb
\.


--
-- TOC entry 4856 (class 0 OID 24649)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, solves, picture) FROM stdin;
103094514328351734590	Sadashiva Shenoy	karnamic@gmail.com	0	https://lh3.googleusercontent.com/a/ACg8ocJxNt1weQUC2VWXwrwAFNHHj_igTBhsdzMjp6ma-AUzX0RL_j8=s96-c
\.


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 215
-- Name: problems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.problems_id_seq', 1, true);


--
-- TOC entry 4702 (class 2606 OID 24633)
-- Name: tasks problems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT problems_pkey PRIMARY KEY (id);


--
-- TOC entry 4706 (class 2606 OID 24692)
-- Name: solved_tasks unique_user_task; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solved_tasks
    ADD CONSTRAINT unique_user_task UNIQUE (userid, taskid);


--
-- TOC entry 4704 (class 2606 OID 24665)
-- Name: users userid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT userid PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 24644)
-- Name: task_files fk_taskfiles_tasks; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_files
    ADD CONSTRAINT fk_taskfiles_tasks FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE SET NULL;


--
-- TOC entry 4708 (class 2606 OID 24686)
-- Name: solved_tasks fk_tasks; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solved_tasks
    ADD CONSTRAINT fk_tasks FOREIGN KEY (taskid) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- TOC entry 4709 (class 2606 OID 24681)
-- Name: solved_tasks fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solved_tasks
    ADD CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-04-14 00:52:57

--
-- PostgreSQL database dump complete
--

