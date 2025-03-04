# TO DO
- add side openable bar to enter new names and then click on update

# Pick And Drop

Pick and Win helps you choose giveaway winners easily. Just add participant names, shuffle them, and pick a winner at random. It's perfect for content creators running giveaways and makes selecting a fair winner quick and simple.

Built with Next.js and styled using Tailwind CSS, this project combines performance with a sleek, responsive design.

## Features

- **Participant Management**  
  Easily add participants individually, in bulk with a comma-separated list, or by entering names line by line. Remove specific names or reset the entire list with a single click for streamlined management.

- **Interactive Shuffle System**  
  Engage with an exciting shuffle process that dynamically highlights participants before selecting a winner. Customize the shuffle duration (default is 3 seconds) and enjoy the suspenseful experience.

- **Flexible Settings**  
  Personalize your experience with adjustable shuffle timers and customizable highlight colors. Access these options seamlessly through the settings menu.

- **Winner Selection Modes**  
  Choose between different winner selection modes:
  - **Last One Standing**: Participants are gradually removed from the list until only one winner remains.
  - **Random Winner**: A winner is selected randomly in a single shuffle.  
  - **Shuffle Mode**: The names are shuffled, and one name is selected randomly.
  - **Wheel Mode**: A circular wheel is displayed, rotates, and selects one winner.
  
  Toggle between these modes to suit the nature of your event.

- **Winner Announcement**  
  When the shuffle concludes, the winner is announced prominently. If only two participants remain, the shuffle automatically picks the winner, redirects to a dedicated winner page, and highlights their name.

- **Seamless Navigation**  
  Easily navigate back to the home page after a winner is announced to start a new round or manage participants.

## Tech Stack

- **Next.js**: A React framework for building server-rendered and static web applications.
- **Tailwind CSS**: A utility-first CSS framework that enables rapid UI development.
- **tailwind-scrollbar**: `npm package` which is used to change scrollbar style.

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
3. **Choose Winner Selection Mode**: Select between Last One Standing, Random Winner, Shuffle, or Wheel mode.  
4. **Start the Selection**: Click "Start" to begin the process based on the selected mode.  
5. **Winner Announcement**: Once the process concludes, the winner is displayed on a dedicated page. Return to the home page to start over or manage new participants.  
6. **Customization**: Adjust styles or functionality as needed using the flexible Tailwind CSS setup.  

## Customization

- Easily adapt the design and functionality to suit your needs by modifying components styled with Tailwind CSS.
- Add additional features or integrate with other tools as per your requirements.

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

Check out the live demo of the project here: https://pickandwin-iota.vercel.app/

## Video Explanation

https://youtu.be/gBu9qU5doiw
