import React from "react";

function HandleText() {
  return (
    <div className="w-[50%] m-auto flex justify-center items-center h-screen p-5 text-center text-white">
      <div className="max-w-2xl">
        <h2 className="text-4xl font-bold leading-tight sm:text-5xl sm:leading-snug">
          Learn to code by
          <br />
          watching others
        </h2>
        <p className="mt-5 text-lg sm:text-xl">
          See how experienced developers solve problems in real-time. Watching
          scripted tutorials is great, but understanding how developers think is
          invaluable.
        </p>
      </div>
    </div>
  );
}

export default HandleText;
