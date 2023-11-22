import React from 'react';

const AboutUs = ({ darkMode }) => {
  const teamMembers = [
    { name: 'Hriday Sehgal', roll: '21BHI10024', linkedin: 'linkedin.com/in/hridaysehgal' },
    { name: 'Aditi Sahu', roll: '21BHI10031', linkedin: 'www.linkedin.com/in/aditi-sahu-41b910251/' },
    { name: 'Yeshodeep Dohre', roll: '21BCG10113', linkedin: 'www.linkedin.com/in/yeshodeep-dohre-b740bb241/' },
    { name: 'Isha Gurnani', roll: '21BCE10944', linkedin: 'www.linkedin.com/in/isha-gurnani-2495b3229/' },
    { name: 'Sanskar Sinha', roll: '21BCG10110', linkedin: 'www.linkedin.com/in/sanskar-sinha/' },
  ];

  const githubLink = 'https://github.com/your-username/your-project-repository';

  return (
    <div className={`container mt-5 ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`card ${darkMode ? 'text-light bg-dark' : ''}`}>
        <div className="card-body">
          <h2 className={`card-title ${darkMode ? 'text-light' : ''}`}>About Us</h2>
          <p className={`card-text ${darkMode ? 'text-light' : ''}`}>
            We are Team 369, working on Project 09 for our MERN Stack internship.
          </p>

          <h4 className={`card-subtitle mb-3 ${darkMode ? 'text-light' : ''}`}>Team Members:</h4>
          <ul className={`list-group ${darkMode ? 'list-group-flush' : ''}`}>
            {teamMembers.map((member) => (
              <li key={member.roll} className={`list-group-item ${darkMode ? 'bg-dark text-light' : ''}`}>
                {member.name} ({member.roll}) -{' '}
                <a href={`https://${member.linkedin}`} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            ))}
          </ul>

          <div className={`mt-3 ${darkMode ? 'text-light' : ''}`}>
            <h4 className={`mb-3 ${darkMode ? 'text-light' : ''}`}>Tech Stack:</h4>
            <div className="card" style={{ background: darkMode ? '#343a40' : ''}} >
              <div className="card-body" >
                <p className={`card-text ${darkMode ? 'text-light' : 'text-dark'}`}>
                  <strong>Frontend:</strong> HTML, CSS, Bootstrap, JavaScript, React.js <br />
                  <strong>Backend:</strong> Node.js, Express.js <br />
                  <strong>Database:</strong> MongoDB
                </p>
              </div>
            </div>
          </div>


          <p className={`mt-3 ${darkMode ? 'text-light' : ''}`}>
            See the project code on GitHub:{' '}
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              GitHub Repository
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
