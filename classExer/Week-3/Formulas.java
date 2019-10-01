//TASK #3 Add import statement here to use the Scanner class

public class Formulas
{
	public static void main (String [] args)
	{

		//identifier declarations
		final int NUMBER = 2 ; // number of scores
		final int SCORE1 = 100; // first test score
		final int SCORE2 = 95; // second test score
		final int BOILING_IN_C = 100; // freezing temperature
		double cToF; // temperature in Celsius
		double average; // arithmetic average
		String output; // line of output to print out

		//TASK #3 Create a Scanner object here
		//TASK #3 declare variables used here


		// Find an arithmetic average
		average = SCORE1 + SCORE2 / NUMBER;
		output = SCORE1 + " and " + SCORE2 +
			" have an average of " + average;
		System.out.println(output);

		// Convert Celsius temperatures to Fahrenheit
		cToF = 9/5 * (BOILING_IN_C + 32);
		output = BOILING_IN_C + " in Fahrenheit is " + cToF
			+ " in Celsius.";

		System.out.println(output);
		System.out.println(); // to leave a blank line


		// ADD LINES FOR TASK #3 HERE
		// prompt the user for a diameter of a sphere
		// read the diameter
		// calculate the radius
		// calculate the volume
		// print out the volume
	}
}