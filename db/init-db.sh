#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOF

    CREATE TABLE public.languages (
        id SERIAL PRIMARY KEY,
        name character varying(255) NOT NULL,
        details character varying(255) NULL,
        author character varying(255) NOT NULL,
        first_release numeric NOT NULL
    );

    INSERT INTO "public"."languages" ("name", "details", "author", "first_release")
        VALUES ('Python', 'https://en.wikipedia.org/wiki/Python_(programming_language)', 'Guido van Rossum', 1991);

    INSERT INTO "public"."languages" ("name", "details", "author", "first_release")
        VALUES ('Java', 'https://en.wikipedia.org/wiki/Java_(programming_language)', 'James Gosling', 1995);

    INSERT INTO "public"."languages" ("name", "details", "author", "first_release")
        VALUES ('C++', 'https://en.wikipedia.org/wiki/C%2B%2B', 'Bjarne Strousstrup', 1985);
        
    INSERT INTO "public"."languages" ("name", "details", "author", "first_release")
        VALUES ('C', 'https://en.wikipedia.org/wiki/C_(programming_language)', 'Dennis Ritchie', 1972);

    CREATE TABLE public.mathematicians (
        id SERIAL PRIMARY KEY,
        name character varying(255) NOT NULL,
        details character varying(255) NULL,
        known_for character varying(255) NOT NULL,
        birth_year numeric NOT NULL
    );

    INSERT INTO "public"."mathematicians" ("name", "details", "known_for", "birth_year")
        VALUES ('Isaac Newton', 'https://en.wikipedia.org/wiki/Isaac_Newton', 'Infinitesimal Calculus', 1643);
    INSERT INTO "public"."mathematicians" ("name", "details", "known_for", "birth_year")
        VALUES ('Leonhard Euler', 'https://en.wikipedia.org/wiki/Leonhard_Euler', 'Number Theory', 1707);
    INSERT INTO "public"."mathematicians" ("name", "details", "known_for", "birth_year")
        VALUES ('Carl Friedrich Gauss', 'https://en.wikipedia.org/wiki/Carl_Friedrich_Gauss', 'Modular Arithmetic', 1777);
    INSERT INTO "public"."mathematicians" ("name", "details", "known_for", "birth_year")
        VALUES ('Srinivasa Ramanujan', 'https://en.wikipedia.org/wiki/Srinivasa_Ramanujan', 'Partition Formula', 1920);

EOF
