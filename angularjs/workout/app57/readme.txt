## Problem
	
	Personal Trainer: 
	Create generic Workout Runner, integrate with Workout Builder.

## Solution

    1. Removing the hardcoded workout and exercises used in 7 Minute Workout from the controller.

    2. Fixing the start page to show all available workouts and allowing users to select a workout to run.

    3. Fixing the workout route configuration to pass the selected workout name as the route parameter to the workout page.

    4. Loading the selected workout data using WorkoutService and starting the workout.