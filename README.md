# Pick And Drop

Pick and Win helps you choose giveaway winners easily. Just add participant names, shuffle them, and pick a winner at random. It's perfect for content creators running giveaways and makes selecting a fair winner quick and simple.

Built with Next.js and styled using Tailwind CSS, this project combines performance with a sleek, responsive design.

## Features

- **Participant Management:** Easily add names one by one or in bulk using a comma-separated format. You can remove individual names or reset the entire list with a single click.
- **Interactive Shuffle System:** Start the shuffle to randomly pick a name within a customizable timer (default 3 seconds). Experience the excitement as names are dynamically highlighted during the shuffle.
- **Flexible Settings:** Use the settings button to adjust the shuffle timer duration or highlighted user background color for a more personalized experience.
- **Winner Announcement:** When only two participants remain, the shuffle automatically picks the winner, removing the selected name and redirecting to a dedicated winner page with their name displayed prominently.
- **Seamless Navigation:** After the winner is announced, navigate back to the home page effortlessly to start a new round or manage participants.

## Tech Stack

- **Next.js**: A React framework for building server-rendered and static web applications.
- **Tailwind CSS**: A utility-first CSS framework that enables rapid UI development.

## Installation

1. Clone the Repository:
    ```bash
    git clone https://github.com/yourusername/pick-and-drop.git
    ```

2. Navigate to the Project Directory:
    ```bash
    cd pick-and-drop
    ```

3. Install Dependencies:
    ```bash
    npm install
    ```

4. Run the Development Server:
    ```bash
    npm run dev
    ```

    The application will be running at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Access the Application**: Open the application in your browser at [http://localhost:3000](http://localhost:3000).  
2. **Manage Participants**: Add participant names individually or in bulk (comma-separated). Remove specific names or reset the list entirely before starting the shuffle.  
3. **Start the Shuffle**: Click "Start" to begin the shuffle, which randomly selects a participant within the set timer. Use the settings button to customize the shuffle timer duration.  
4. **Winner Announcement**: Once the shuffle between the last two participants concludes, the winner is displayed on a dedicated page. Return to the home page to start over or manage new participants.  
5. **Customization**: Adjust styles or functionality as needed using the flexible Tailwind CSS setup.  


## Customization

- Easily adapt the design and functionality to suit your needs by modifying components styled with Tailwind CSS.
- Add additional features or integrate with other tools as per your requirements.

## Changes Which You Can Make

1. You can change the shuffle speed
    ```bash
    setIsChoosing(true);
        const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        setCurrentName(names[randomIndex]);
    }, 70);
    ```
    Change `70` to your desired speed

## Contributing

If you'd like to contribute to this project:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit:
    ```bash
    git commit -am 'Add new feature'
    ```
4. Push the changes to your fork:
    ```bash
    git push origin feature-branch
    ```
5. Create a Pull Request.

## Live Demo

Check out the live demo of the project here: [https://pickandwin-k3yn.vercel.app/](https://pickandwin-k3yn.vercel.app/)

## Video Explaination

