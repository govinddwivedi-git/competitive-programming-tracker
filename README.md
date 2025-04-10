# Competitive Programming Community Tracker

A comprehensive platform for tracking and analyzing competitive programming performance across multiple coding platforms. This system helps students monitor their progress and rankings across different competitive programming websites while providing detailed analysis of their coding journey.

## Features

- **Multi-Platform Rating Tracking**
  - Real-time Codeforces rating updates
  - Current CodeChef rankings
  - LeetCode progress tracking

- **Codeforces Profile Analysis**
  - Detailed submission statistics
  - Problem difficulty distribution
  - Contest participation history
  - Rating progression over time
  - Problem tags analysis

- **Community Features**
  - Compare rankings with peers
  - Track community progress
  - View leaderboards

## Tech Stack

### Frontend
- React.js
- Material-UI
- Chart.js (for analytics visualization)

### Backend
- Node.js
- Express.js
- MySQL Database

### APIs Integration
- Codeforces API
- CodeChef API
- LeetCode API

## Project Screenshots

![Screenshot 1](./screenshots/Screenshot%20(2185).png)
*Sign Up Form*

![Screenshot 2](./screenshots/Screenshot%20(2186).png)
*Login Form*

![Screenshot 3](./screenshots/Screenshot%20(2188).png)
*Dashboard*

![Screenshot 4](./screenshots/Screenshot%20(2189).png)
*Analysis of Codeforces*

![Screenshot 5](./screenshots/Screenshot%20(2190).png)
*Analysis of Codeforces*

![Screenshot 6](./screenshots/Screenshot%20(2191).png)
*Analysis of Codeforces*

![Screenshot 7](./screenshots/Screenshot%20(2192).png)
*Analysis of Codeforces*

![Screenshot 8](./screenshots/Screenshot%20(2193).png)
*Analysis of Codeforces*

![Screenshot 9](./screenshots/Screenshot%20(2195).png)
*Codechef Statistics*

![Screenshot 10](./screenshots/Screenshot%20(2196).png)
*Codeforces Statistics*

![Screenshot 11](./screenshots/Screenshot%20(2203).png)
*Leetcode Statistics*

![Screenshot 12](./screenshots/Screenshot%20(2204).png)
*User Profile*

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/govinddwivedi-git/competitive-programming-tracker.git
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. Configure environment variables
```bash
# Create .env file in backend directory
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

4. Start the application
```bash
# Frontend
npm start

# Backend
npm run dev
```

## API Configuration

To use the platform, you'll need to set up API keys for:
- Codeforces API
- CodeChef API
- LeetCode API

Add these keys to your backend .env file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
