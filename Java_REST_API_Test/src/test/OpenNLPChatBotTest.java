// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.Assertions.*;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.RepeatedTest;

// public class OpenNLPChatBotTest {
//     Access test; 

//     @BeforeEach
//     void setUp() {
//         test = new Access();
//     }
//     @Test
//     void testCountdown() { 
//         String result = test.countdown(); 
//         assertEquals("The Answer",result,"Error with time check...");
//     }

//     @Test
//     void testWhenIs() {  
//         String result = test.whenIsNextEvent("cycling"); 
//         assertEquals("The Answer",result,"Error when searching for when the event is");

//     }

//     @RepeatedTest(5)
//     void testWhereIs() {
//         String result = test.venueOrSport("cycling"); 
//         assertEquals("The Answer",result,"Error when searching for cycling event location");

//     }
//     @Test
//     void testCategory() {  
//         OpenNLPChatBot test2 = new OpenNLPChatBot();
//         String [] someString;  
//         String result = test2.detectCategory(someString); 
//         assertEquals("The Answer",result,"Error when deciding on a category");

//     }
// }