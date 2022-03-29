import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;
import java.util.stream.Collectors;

import opennlp.tools.cmdline.parser.ParserTool;
import opennlp.tools.doccat.BagOfWordsFeatureGenerator;
import opennlp.tools.doccat.DoccatFactory;
import opennlp.tools.doccat.DoccatModel;
import opennlp.tools.doccat.DocumentCategorizerME;
import opennlp.tools.doccat.DocumentSample;
import opennlp.tools.doccat.DocumentSampleStream;
import opennlp.tools.doccat.FeatureGenerator;
import opennlp.tools.lemmatizer.LemmatizerME;
import opennlp.tools.lemmatizer.LemmatizerModel;
import opennlp.tools.parser.Parse;
import opennlp.tools.parser.Parser;
import opennlp.tools.parser.ParserFactory;
import opennlp.tools.parser.ParserModel;
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

	private Map<String, String> staticAnswers = new HashMap<>();
	private Map<String, Function<String, String>> dynamicResponses = new HashMap<>();
	private DoccatModel model;

	/*
	 * Questions and answers from https://discover.brocku.ca/registration/faqs/
	 */
	public OpenNLPChatBot() {
		staticAnswers.put("greeting", "Hello, how can I help you?");
		staticAnswers.put("transportation", "The events will take place at ... bus routes can be found here: https://www.niagararegion.ca/transit/routes.aspx?home_task=1");
		staticAnswers.put("website", "Information can be found on the website here:");
		dynamicResponses.put("start", (unused) -> Access.countdown());
		dynamicResponses.put("where_is", Access::venueOrSport); // Answers what events are at a specific venue, or where an event is hosted
		//dynamicResponses.put("when_is", Access::whenIsNextEvent);
//		staticAnswers.put("news", "News articles on the games can be found here:_________");
//		staticAnswers.put("parking","Parking info can be found:______________");
//		staticAnswers.put("accommodations","Hotels and other accomidations can be found: ");
//		staticAnswers.put("restaurants","A list of near by Restaurants can be found: ");
//		staticAnswers.put("food","Food rules can be found here:___________");
//		staticAnswers.put("accessibility", "Accessibility options can be found here:______");
//		staticAnswers.put("things", "Some activities that can be found are:_______________");
//		staticAnswers.put("medical", "For medical emergencies please contact 911. The nearest hospital is: St.Catharines General hospital [1200 Fourth Ave, St. Catharines, ON L2S 0A9].");
//		staticAnswers.put("airport"," The nearest airports are:_________");
//		staticAnswers.put("viewing", "The events can be viewed at these locations: ");

		
		try {
			// Train categorizer model to the training data we created.
			model = trainCategorizerModel();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	//Random selector for testing purposes, simulating a question (between asking for an event or asking for a venue)
	private String getSportOrVenue(){
		Random rand = new Random(); 
		int upper = 2;
		int randInt = rand.nextInt(upper);
		if (randInt == 0) {
			return getSport();
		}
		else {
			return getVenue();
		}
	}

	private String getSport(){
		Random rand = new Random(); 
		String sport = null;
		int upper = 4;
		int randInt = rand.nextInt(upper);
		if (randInt == 0) {
			sport = "baseball";
		}else if (randInt == 1) {
			sport = "basketball";
		}else if (randInt == 2) {
			sport = "swimming";
		}else if (randInt == 3) {
			sport = "cycling";
		}
		return sport;
	}

	private String getVenue(){
		Random rand = new Random(); 
		String sport = null;
		int upper = 4;
		int randInt = rand.nextInt(upper);
		if (randInt == 0) {
			sport = "Brock Sport Facilities";
		}else if (randInt == 1) {
			sport = "Brock University";
		}else if (randInt == 2) {
			sport = "Canada Games Park";
		}else if (randInt == 3) {
			sport = "Welland International Flatwater Centre";
		}
		return sport;
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
				if(this.staticAnswers.containsKey(category)) {
					answer = answer + " " + staticAnswers.get(category);
				} else if(this.dynamicResponses.containsKey(category)) {
					answer = answer + " " + dynamicResponses.get(category).apply(getNoun(sentence));
				}
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
		// TrainingFile.txt is a custom training data with categories as per our chat requirements.
		InputStreamFactory inputStreamFactory = new MarkableFileInputStreamFactory(new File("./TrainingFile.txt"));
		ObjectStream<String> lineStream = new PlainTextByLineStream(inputStreamFactory, StandardCharsets.UTF_8);
		ObjectStream<DocumentSample> sampleStream = new DocumentSampleStream(lineStream);

		TrainingParameters params = ModelUtil.createDefaultTrainingParameters();
		params.put(TrainingParameters.CUTOFF_PARAM, 0);
		DoccatFactory factory = new DoccatFactory(new FeatureGenerator[] { new BagOfWordsFeatureGenerator() });

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
	private String[] breakSentences(String data) throws FileNotFoundException, IOException {
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
	
	private String getNoun(String sentence) {
		try (InputStream modelIn = new FileInputStream("models/en-parser-chunking.bin")) {
   
			ParserModel model = new ParserModel(modelIn);
			Parser parser = ParserFactory.create(model);
			Parse topParses[] = ParserTool.parseLine(sentence.toLowerCase(), parser, 1);
   
			topParses[0].show();
			Parse noun = findParseByType(topParses[0], "NN");
			if(noun == null) {
				noun = findParseByType(topParses[0], "NP"); // Couldn't find noun, get the entire noun phrase
			}
			return noun.getCoveredText().replace(".", "").replace("!", "").replace("?", "").trim(); // Sanitize and return result
		} catch(IOException e) {
		}
		return null;
	}
	
	private Parse findParseByType(Parse parseTree, String type) {
		if(parseTree.getType().equalsIgnoreCase(type)) {
			return parseTree;
		} else if(parseTree.getChildCount() > 0) {
			for(Parse child : parseTree.getChildren()) {
				Parse result = findParseByType(child, type);
				if(result != null) return result;
			}
		}
		return null; // Could not find.
	}


	public static void main(String... args) {
		new WebServer();
	}

}
