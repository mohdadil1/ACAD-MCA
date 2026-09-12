import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../UI/Card/Card";
import Jumbotron from '../UI/Jumbotron/Jumbotron';
import BackLink from './BackLink';
import { ORDINAL_YEAR } from './ordinalYear';
import './Classroom.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Classroom = () => {
    const { course } = useParams();
    const [courseInfo, setCourseInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${apiUrl}/courses`, { withCredentials: true });
                const found = res.data.find((c) => c.key === course);
                setCourseInfo(found || null);
            } catch (err) {
                setCourseInfo(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [course]);

    if (loading) {
        return (
            <Fragment>
                <Jumbotron title="Classroom" description="Loading…" />
            </Fragment>
        );
    }

    if (!courseInfo) {
        const courseName = course?.toUpperCase();
        return (
            <Fragment>
                <Jumbotron title={`${courseName} Classroom`} description="Semester wise Teacher's Slides and notes..." />
                <BackLink to="/classroom" label="Back to Courses" />
                <div className="classroom">
                    <div className="text-center py-12 px-4">
                        <p className="text-xl text-gray-500 font-sans">
                            {courseName} resources are coming soon. Check back later!
                        </p>
                    </div>
                </div>
            </Fragment>
        );
    }

    const years = Array.from({ length: courseInfo.years }, (_, i) => i + 1);

    return (
        <Fragment>
            <Jumbotron title={`${courseInfo.name} Classroom`} description="Choose your year to see the semesters" />
            <BackLink to="/classroom" label="Back to Courses" />
            <div className="classroom">
                <div className="card-deck">
                    {years.map((year) => (
                        <Card
                            key={year}
                            title={ORDINAL_YEAR[year] || `Year ${year}`}
                            link={`/classroom/${course}/year${year}`}
                            linkText={`Go to Year ${year}`}
                        />
                    ))}
                </div>
            </div>
        </Fragment>
    );
};
export default Classroom;
