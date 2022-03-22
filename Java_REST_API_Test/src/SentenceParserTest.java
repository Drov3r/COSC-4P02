import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Scanner;

import opennlp.tools.cmdline.parser.ParserTool;
import opennlp.tools.parser.Parse;
import opennlp.tools.parser.Parser;
import opennlp.tools.parser.ParserFactory;
import opennlp.tools.parser.ParserModel;

public class SentenceParserTest {
	
	public SentenceParserTest() {
		test();
	}
	
	public void test() {
		OpenNLPChatBot ai = new OpenNLPChatBot();
		try(Scanner scanner = new Scanner(System.in)) {
			String input = scanner.nextLine();
			
			try {
				// Break users chat input into sentences using sentence detection.
				String[] sentences = ai.breakSentences(input);
				
				// Loop through sentences.
				for(String sentence : sentences) {
					parse(sentence);
				}
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	private Parse[] parse(String sentence) throws IOException {
		try (InputStream modelIn = new FileInputStream("models/en-parser-chunking.bin")) {

			ParserModel model = new ParserModel(modelIn);
			Parser parser = ParserFactory.create(model);
			Parse topParses[] = ParserTool.parseLine(sentence, parser, 1);
			
			topParses[0].show();
			System.out.println("Subject:" + findParseByType(topParses[0], "NN", "NNP"));

			return topParses;

		}

	}
	
	private Parse findParseByType(Parse parseTree, String... types) {
		if(Arrays.asList(types).contains(parseTree.getType())) {
			return parseTree;
		} else if(parseTree.getChildCount() > 0) {
			for(Parse child : parseTree.getChildren()) {
				Parse result = findParseByType(child, types);
				if(result != null) return result;
			}
		}
		return null; // Could not find.
	}
	
	public static void main(String... args) {
		new SentenceParserTest();
	}

}
