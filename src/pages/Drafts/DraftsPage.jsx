import React from "react";
import LineMatchingGame from "../../Drafts.jsx/Match";
import WordArrangementPuzzle from "../../Drafts.jsx/WordArrangement";

const DraftsPage = () => {
  return (
    <div>
      <h1 className="text-center py-5">Line Match game</h1>
      <div className="w-full max-w-3xl mx-auto rounded-lg overflow-hidden">

      <LineMatchingGame />
      </div>

      <hr />
      <h1 className="text-center py-5">Word Arrangement Puzzle</h1>
      <WordArrangementPuzzle />
    </div>
  );
};

export default DraftsPage;

