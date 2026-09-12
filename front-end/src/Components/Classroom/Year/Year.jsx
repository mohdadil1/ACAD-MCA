import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../../UI/Card/Card";
import Jumbotron from '../../UI/Jumbotron/Jumbotron';
import { ORDINAL_YEAR } from '../ordinalYear';
import '../Classroom.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Year = () => {
    const { course, year } = useParams();
    const [courseName, setCourseName] = useState(course?.toUpperCase());
    const yearNumber = parseInt((year || '').replace('year', ''), 10);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${apiUrl}/courses`, { withCredentials: true });
                const found = res.data.find((c) => c.key === course);
                if (found) setCourseName(found.name);
            } catch (err) {
                // keep the uppercased slug as a fallback title
            }
        };
        fetchCourse();
    }, [course]);

    // Each year has two semesters: Year 1 -> Semester 1, 2; Year 2 -> Semester 3, 4; etc.
    const firstSemester = (yearNumber - 1) * 2 + 1;
    const secondSemester = firstSemester + 1;

    return (
        <Fragment>
            <Jumbotron
                title={`${courseName} - ${ORDINAL_YEAR[yearNumber] || `Year ${yearNumber}`}`}
                description="Choose your semester to see subject-wise resources"
            />
            <div className="classroom">
                <div className="card-deck">
                    <Card
                        title={`Semester ${firstSemester}`}
                        link={`/classroom/${course}/${year}/semester${firstSemester}`}
                        linkText={`Go to Semester ${firstSemester}`}
                    />
                    <Card
                        title={`Semester ${secondSemester}`}
                        link={`/classroom/${course}/${year}/semester${secondSemester}`}
                        linkText={`Go to Semester ${secondSemester}`}
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default Year;
