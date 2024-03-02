using Microsoft.AspNetCore.SignalR;

namespace MessengerApp.Hubs
{
    public class ChatHub: Hub
    {
        public void Send(string username,string message)
        {
            this.Clients.All.SendAsync("Receive", username, message);
        } 
        public void SendImg(string username,string img)
        {
            this.Clients.All.SendAsync("ReceiveImg", username, img);
        }
    }
}
