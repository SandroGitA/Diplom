using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace client.Models
{
    public class RequestServices
    {
        public List<Task> GetAllTasks()
        {
            string html = string.Empty;
            string url = "http://37.143.15.111:800/values/";
            List<Task> AllTasks = new List<Task>(); 

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.AutomaticDecompression = DecompressionMethods.GZip;

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                html = reader.ReadToEnd();
                AllTasks = JsonConvert.DeserializeObject<List<Task>>(html);
                return AllTasks;
            }            
        }
    }
}
