import React from "react";

import HomeParent from "../Pages/Parent/HomeParent";
import TimeTableForParent from "../Pages/Parent/TimeTableForParent";
import TuitionForParent from "../Pages/Parent/TuitionForParent";
import ChildrenForParent from "../Pages/Parent/ChildrenForParent";

const ParentRoutes = [
  { path: "/parent/dashboard", element: <HomeParent />, role: "parent" },
  {
    path: "/parent/timetable",
    element: <TimeTableForParent />,
    role: "parent",
  },
  { path: "/parent/tuition", element: <TuitionForParent />, role: "parent" },
  {
    path: "/parent/children-management",
    element: <ChildrenForParent />,
    role: "parent",
  },
];

export default ParentRoutes;
