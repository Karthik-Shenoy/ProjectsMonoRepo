--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-03-27 16:51:07

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
-- TOC entry 4847 (class 0 OID 0)
-- Dependencies: 215
-- Name: problems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.problems_id_seq OWNED BY public.tasks.id;


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
-- TOC entry 4692 (class 2604 OID 24629)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.problems_id_seq'::regclass);


--
-- TOC entry 4841 (class 0 OID 24634)
-- Dependencies: 217
-- Data for Name: task_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_files (task_id, file_name, file_type) FROM stdin;
1	loadbalancer.ts	1
1	contracts.ts	0
\.


--
-- TOC entry 4840 (class 0 OID 24626)
-- Dependencies: 216
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, num_solves, markdown_url, task_dir) FROM stdin;
1	Load balancing, load balancers!	Modern distributed applications require dynamic scaling to handle variable workloads efficiently. implement automatic scaling with service discovery mechanisms, continuous configuration updates, and intelligent load balancing to ensure maximum reliability and optimal resource utilization during traffic fluctuations.	0	/PROBLEMS/LBLBS	lblb
\.


--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 215
-- Name: problems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.problems_id_seq', 1, true);


--
-- TOC entry 4694 (class 2606 OID 24633)
-- Name: tasks problems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT problems_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 24644)
-- Name: task_files fk_taskfiles_tasks; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_files
    ADD CONSTRAINT fk_taskfiles_tasks FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE SET NULL;


-- Completed on 2025-03-27 16:51:11

--
-- PostgreSQL database dump complete
--

