import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import Card from "../../UI/Card/Card";
import Jumbotron from '../../UI/Jumbotron/Jumbotron';
import { COURSES, ORDINAL_YEAR } from '../Courses/Courses';
import '../Classroom.css';

const Year = () => {
    const { course, year } = useParams();
    const courseInfo = COURSES.find((c) => c.id === course);
    const courseName = courseInfo ? courseInfo.name : course?.toUpperCase();
    const yearNumber = parseInt((year || '').replace('year', ''), 10);

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
