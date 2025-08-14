import React, { useState } from "react";
import TestAccordion from "./TestAccordion";

const TestsTab = ({ tests }) => {
  const [expandedTest, setExpandedTest] = useState(null);

  const handleToggle = (index) => {
    setExpandedTest(expandedTest === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {tests.map((test, index) => (
        <TestAccordion
          key={index}
          testData={test}
          isExpanded={expandedTest === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default TestsTab;
