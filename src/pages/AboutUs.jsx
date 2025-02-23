import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="title">About EduLinker</h1>
      <p className="description">
        EduLinker is a student-focused platform designed to bridge skill gaps
        caused by unawareness, peer influence, and financial constraints.
      </p>
      <p className="description">
        Our mission is to create a collaborative learning environment where
        students can share knowledge, find project partners, and book slots for
        peer-to-peer learning sessions.
      </p>
      <h2 className="subtitle">Why Choose EduLinker?</h2>
      <ul className="list">
        <li>Connect with like-minded learners.</li>
        <li>Share and access knowledge freely.</li>
        <li>Find project partners effortlessly.</li>
        <li>Enhance learning through discussions and mentorship.</li>
      </ul>
    </div>
  );
};

export default AboutUs;
