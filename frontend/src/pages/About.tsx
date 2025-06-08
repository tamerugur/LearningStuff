export function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="p-8 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">About Me</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Hi! My name is Tamer Ugur. Currently, I'm a full stack developer at
          Ziraat Technology, the software company of the biggest bank in Turkey.
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          professionally, I've worked with <b>React</b>, <b>.NET</b>,{" "}
          <b>TypeScript</b>, <b>PLSQL</b> before and I've used a lot more in my
          personal projects like <b>Python</b>, <b>Next.js</b>, <b>Angular</b>,{" "}
          <b>Docker</b> etc.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          I'm always trying to improve my understanding of programming and learn
          new technologies.
        </p>
      </div>
    </div>
  );
}
