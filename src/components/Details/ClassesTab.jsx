import React, { useState } from "react";
import ClassAccordion from "./ClassAccordion";

const ClassesTab = ({ classes }) => {
  const [expandedClass, setExpandedClass] = useState(null);

  const handleToggle = (index) => {
    setExpandedClass(expandedClass === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {classes.map((classItem, index) => (
        <ClassAccordion
          key={index}
          classData={classItem}
          isExpanded={expandedClass === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default ClassesTab;
