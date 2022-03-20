import java.util.UUID;

public class Message {
	
	private UUID conversationID;
	private String message;
	private long timestamp;
	
	public Message(UUID conversationID, String message, long timestamp) {
		this.conversationID = conversationID;
		this.message = message;
		this.timestamp = timestamp;
	}
	
	public Message() {} // This is needed for Jackson to be able to deserialize the json

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public UUID getConversationID() {
		return conversationID;
	}

	public long getTimestamp() {
		return timestamp;
	}

}