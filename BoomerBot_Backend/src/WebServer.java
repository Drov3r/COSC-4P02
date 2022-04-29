import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class WebServer {
	
	private OpenNLPChatBot ai;
	
	public WebServer() {
		start();
	}
	
	public void start() {
		ai = new OpenNLPChatBot();
		try {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
		    server.createContext("/api/message", new Handler());
            server.setExecutor(null);
            server.start();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	class Handler implements HttpHandler {
		
        @Override
        public void handle(HttpExchange t) throws IOException {
        	if(t.getRequestMethod().equals("GET")) {
        		String out = "The API is used internally for the chat bot.";
        		t.sendResponseHeaders(200, out.length());
            	OutputStream os = t.getResponseBody();
            	os.write(out.getBytes());
            	os.close();
        	} else if(t.getRequestMethod().equals("POST")) {
        		byte[] bytes = t.getRequestBody().readAllBytes();
        		String rawMessage = new String(bytes);
        		ObjectMapper mapper = new ObjectMapper();
            	Message inboundMessage = mapper.readValue(rawMessage, Message.class);
            	System.out.println("Received message \"" + inboundMessage.getMessage() + "\" from " + t.getRemoteAddress().getHostString());
            	Message response = processMessage(inboundMessage);
            	System.out.println("Sending message \"" + response.getMessage() + "\" to " + t.getRemoteAddress().getHostString());
            	String rawResponse = mapper.writeValueAsString(response);
            	t.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            	t.getResponseHeaders().add("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
            	t.sendResponseHeaders(200, rawResponse.getBytes().length);
            	OutputStream os = t.getResponseBody();
            	os.write(rawResponse.getBytes());
            	os.close();
        	}
        }

		private Message processMessage(Message inboundMessage) {
			Message response = new Message(inboundMessage.getConversationID(), "", System.currentTimeMillis());
			response.setMessage(ai.getAnswerToQuestion(inboundMessage.getMessage()));
			return response;
		}
    }

}
