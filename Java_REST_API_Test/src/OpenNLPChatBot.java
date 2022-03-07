import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import opennlp.tools.doccat.BagOfWordsFeatureGenerator;
import opennlp.tools.doccat.DoccatFactory;
import opennlp.tools.doccat.DoccatModel;
import opennlp.tools.doccat.DocumentCategorizerME;
import opennlp.tools.doccat.DocumentSample;
import opennlp.tools.doccat.DocumentSampleStream;
import opennlp.tools.doccat.FeatureGenerator;
import opennlp.tools.lemmatizer.LemmatizerME;
import opennlp.tools.lemmatizer.LemmatizerModel;
import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.util.InputStreamFactory;
import opennlp.tools.util.InvalidFormatException;
import opennlp.tools.util.MarkableFileInputStreamFactory;
import opennlp.tools.util.ObjectStream;
import opennlp.tools.util.PlainTextByLineStream;
import opennlp.tools.util.TrainingParameters;
import opennlp.tools.util.model.ModelUtil;

/**
 * Most of this class is borrowed from: https://github.com/itsallbinary/apache-opennlp-chatbot-example
 * 
 * Custom chat bot or chat agent for automated chat replies for FAQs. It uses
 * different features of Apache OpenNLP for understanding what user is asking
 * for. NLP is natural language processing.
 *
 */
public class OpenNLPChatBot {

	private Map<String, String> questionAnswer = new HashMap<>();
	private DoccatModel model;

	/*
	 * Questions and answers from https://discover.brocku.ca/registration/faqs/
	 */
	public OpenNLPChatBot() {
		questionAnswer.put("greeting", "Hello, how can I help you?");
		questionAnswer.put("calendar", "To find out what courses you need to take, you’ll need to review your course calendar. This can be found at brocku.ca/webcal/current/undergrad");
		questionAnswer.put("timetable", ""
				+ "To find out when your first-year courses (1PXX, 1FXX, etc.) are taking place, you’ll need to review the course timetable. This can be found at brocku.ca/guides-and-timetables/timetables/?session=fw&type=ug&level=year1\n"
				+ "\n"
				+ "To find out when your upper year courses (2PXX, 2FXX, 3PXX, etc.) are taking place, you’ll need to review the returning students timetable. This can be found at brocku.ca/guides-and-timetables/timetables/?session=fw&type=ug&level=all");
		questionAnswer.put("credits", "First year students usually take 5.0 credits throughout the fall/winter terms and most students choose to take 2.5 credits each term to balance their course load. These courses may be a full (1.0) credit, indicated by an “F” in the course code, or a half (0.5) credit, indicated by a “P”, “Q”, or “V” in the course code. When you are choosing courses, add up the number of credits that you are taking each term, and in total, to ensure that you have a complete and balanced schedule.");
		questionAnswer.put("restricted", ""
				+ "Certain courses (ex. BIOL 1P91 and CHEM 1P92) are restricted to majors that are a part of the Faulty of Mathematics and Sciences until the dates indicated in the notes section of the Registration Guide. After this date, the class is open to all other students who have the class as a required course for their program (predominately Faculty of Applied Health Sciences students)\n"
				+ "\n"
				+ "Other classes may be restricted to non-major students until the date indicated in the Registration Guide, and these students can add that course as an elective provided there is space available.");
		questionAnswer.put("conflict", "If you have a scheduling conflict when registering for courses, re-examine the registration guide and see whether one of the conflicting courses is offered at a different time and/or place. You will need to be flexible in your context and elective credits, as your required courses may only be offered at one time.");
		questionAnswer.put("tuition", "Tuition fees are calculated in early August, and will be posted to a students my.brocku.ca portal under their Student Financial History at that time.");
		questionAnswer.put("resp", "In order to order a confirmation of enrollment letter for an RESP, you will need to log on to your my.brocku.ca student portal. Choose “Student Self-Serve Menu”, “GenReqForms”, and then “Forms&Services”. Follow the steps and choose the correct form from options, filling out the necessary information. This form can be sent to you by email, fax, mail, or can be picked up from Brock Central @ The Registrar’s Office. Students should ensure they have registered fully before requesting the letter to accurately reflect their status as a student.");
		questionAnswer.put("electives", "Elective credits are simply courses that are not a part of the required courses for a student in a particular program, and that do not have a prerequisite or any other restrictions. These courses are usually interest-based since the student has some choice as to what they would like to take. While there is not a specific “list” of electives, you can peruse courses that are of interest to you that are open to non-majors and are not part of your program requirements.");
		questionAnswer.put("class_types", "Find the list of class types here: https://discover.brocku.ca/registration/faqs/");
		questionAnswer.put("lec_lec2", "The difference between LEC and LEC2 (and/or LEC 3) is simply that some courses require multiple lectures to be able to accommodate the number of students that are enrolled. On the registration guide, the time and location of LEC and LEC 2 and/or LEC 3 will be different, but these are not different options for you to choose from – you must attend all the timeslots to meet the requirements of the course.");
		questionAnswer.put("permission", "Some courses are restricted to students who are of a certain major or program. If you are interested in taking a course that has certain restrictions, you may require a course override, or permission of the instructor for you to be able to register.");
		questionAnswer.put("context_credits", "To view a list of context credits, please visit discover.brocku.ca/context-credits");
		questionAnswer.put("where_register", "When the registration system opens, you’ll need to log in to your my.brocku.ca student portal and click on the Register link on the left-hand side.");
		questionAnswer.put("text_books", "\n"
				+ " - The Booklist release date is August 6th  – visit campusstore.brocku.ca to order your textbooks\n"
				+ " - The Brock Booklist is a list that shows all courses and required course materials as assigned by your professors/ instructors\n"
				+ " - Purchase early to ensure you have all your course materials for the first day of class\n"
				+ " - Both digital and print options will be made available whenever possible\n"
				+ " - Shipping of online orders will be done via courier service, with average shipping taking 2-4 business days\n");
		questionAnswer.put("advisor", "Your academic advisor can help you with a number of different things — ensuring you’re on the right path to graduate, help add a minor or change majors, etc. — and you can find your advisor by visiting brocku.ca/academic-advising/find-your-advisor");
		questionAnswer.put("course_codes", "\n"
				+ " - F → 1.00 credit\n"
				+ " - G → 1.00 credit\n"
				+ " - P → 0.50 credit\n"
				+ " - Q → 0.50 credit\n"
				+ " - R → 0.50 credit\n"
				+ " - V → 0.50 credit\n"
				+ " - Y → 0.25 credit\n");
		questionAnswer.put("durations", "\n"
				+ " - D1 course\n"
				+ "   Duration 1 – September to April\n"
				+ " - D2 course\n"
				+ "   Duration 2 – September to December\n"
				+ " - D3 course\n"
				+ "   Duration 3 – January to April\n");
		questionAnswer.put("days_of_week", "\n"
				+ " - M – Monday\n"
				+ " - T – Tuesday\n"
				+ " - W – Wednesday\n"
				+ " - T or R – Thursday\n"
				+ " - F – Friday\n");
		questionAnswer.put("building_codes", "See a list of building codes here: https://discover.brocku.ca/registration/faqs/");
		
		try {
			// Train categorizer model to the training data we created.
			model = trainCategorizerModel();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	protected String getAnswerToQuestion(String question) {
		String answer = "";
		try {
			// Break users chat input into sentences using sentence detection.
			String[] sentences = breakSentences(question);
			
			// Loop through sentences.
			for (String sentence : sentences) {
				System.out.println(sentence);
				// Separate words from each sentence using tokenizer.
				String[] tokens = tokenizeSentence(sentence);
				
				// Tag separated words with POS tags to understand their grammatical structure.
				String[] posTags = detectPOSTags(tokens);
				
				// Lemmatize each word so that its easy to categorize.
				String[] lemmas = lemmatizeTokens(tokens, posTags);
				
				// Determine BEST category using lemmatized tokens used a mode that we trained at start.
				String category = detectCategory(model, lemmas);
				
				// Get predefined answer from given category & add to answer.
				answer = answer + " " + questionAnswer.get(category);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return answer;
	}

	/**
	 * Train categorizer model as per the category sample training data we created.
	 * 
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	private DoccatModel trainCategorizerModel() throws FileNotFoundException, IOException {
		// faq-categorizer.txt is a custom training data with categories as per our chat requirements.
		InputStreamFactory inputStreamFactory = new MarkableFileInputStreamFactory(new File("faq-categorizer.txt"));
		ObjectStream<String> lineStream = new PlainTextByLineStream(inputStreamFactory, StandardCharsets.UTF_8);
		ObjectStream<DocumentSample> sampleStream = new DocumentSampleStream(lineStream);

		DoccatFactory factory = new DoccatFactory(new FeatureGenerator[] { new BagOfWordsFeatureGenerator() });

		TrainingParameters params = ModelUtil.createDefaultTrainingParameters();
		params.put(TrainingParameters.CUTOFF_PARAM, 0);

		// Train a model with classifications from above file.
		DoccatModel model = DocumentCategorizerME.train("en", sampleStream, params, factory);
		return model;
	}

	/**
	 * Detect category using given token. Use categorizer feature of Apache OpenNLP.
	 * 
	 * @param model
	 * @param finalTokens
	 * @return
	 * @throws IOException
	 */
	private String detectCategory(DoccatModel model, String[] finalTokens) throws IOException {

		// Initialize document categorizer tool
		DocumentCategorizerME myCategorizer = new DocumentCategorizerME(model);

		// Get best possible category.
		double[] probabilitiesOfOutcomes = myCategorizer.categorize(finalTokens);
		String category = myCategorizer.getBestCategory(probabilitiesOfOutcomes);
		System.out.println("Category: " + category);

		return category;

	}

	/**
	 * Break data into sentences using sentence detection feature of Apache OpenNLP.
	 * 
	 * @param data
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public String[] breakSentences(String data) throws FileNotFoundException, IOException {
		// Better to read file once at start of program & store model in instance
		// variable. but keeping here for simplicity in understanding.
		try (InputStream modelIn = new FileInputStream("models/en-sent.bin")) {

			SentenceDetectorME myCategorizer = new SentenceDetectorME(new SentenceModel(modelIn));

			String[] sentences = myCategorizer.sentDetect(data);
			System.out.println("Sentence Detection: " + Arrays.stream(sentences).collect(Collectors.joining(" | ")));

			return sentences;
		}
	}

	/**
	 * Break sentence into words & punctuation marks using tokenizer feature of
	 * Apache OpenNLP.
	 * 
	 * @param sentence
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	private String[] tokenizeSentence(String sentence) throws FileNotFoundException, IOException {
		// Better to read file once at start of program & store model in instance
		// variable. but keeping here for simplicity in understanding.
		try (InputStream modelIn = new FileInputStream("models/en-token.bin")) {

			// Initialize tokenizer tool
			TokenizerME myCategorizer = new TokenizerME(new TokenizerModel(modelIn));

			// Tokenize sentence.
			String[] tokens = myCategorizer.tokenize(sentence);
			System.out.println("Tokenizer : " + Arrays.stream(tokens).collect(Collectors.joining(" | ")));

			return tokens;

		}
	}

	/**
	 * Find part-of-speech or POS tags of all tokens using POS tagger feature of
	 * Apache OpenNLP.
	 * 
	 * @param tokens
	 * @return
	 * @throws IOException
	 */
	private String[] detectPOSTags(String[] tokens) throws IOException {
		// Better to read file once at start of program & store model in instance
		// variable. but keeping here for simplicity in understanding.
		try (InputStream modelIn = new FileInputStream("models/en-pos-maxent.bin")) {

			// Initialize POS tagger tool
			POSTaggerME myCategorizer = new POSTaggerME(new POSModel(modelIn));

			// Tag sentence.
			String[] posTokens = myCategorizer.tag(tokens);
			System.out.println("POS Tags : " + Arrays.stream(posTokens).collect(Collectors.joining(" | ")));

			return posTokens;

		}

	}

	/**
	 * Find lemma of tokens using lemmatizer feature of Apache OpenNLP.
	 * 
	 * @param tokens
	 * @param posTags
	 * @return
	 * @throws InvalidFormatException
	 * @throws IOException
	 */
	private String[] lemmatizeTokens(String[] tokens, String[] posTags) throws InvalidFormatException, IOException {
		// Better to read file once at start of program & store model in instance
		// variable. but keeping here for simplicity in understanding.
		try (InputStream modelIn = new FileInputStream("models/en-lemmatizer.bin")) {

			// Tag sentence.
			LemmatizerME myCategorizer = new LemmatizerME(new LemmatizerModel(modelIn));
			String[] lemmaTokens = myCategorizer.lemmatize(tokens, posTags);
			System.out.println("Lemmatizer : " + Arrays.stream(lemmaTokens).collect(Collectors.joining(" | ")));

			return lemmaTokens;

		}
	}
	
	public static void main(String... args) {
		new WebServer();
	}

}