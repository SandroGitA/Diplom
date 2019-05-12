using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace client.Models
{
    public class Tasks
    {
        private List<Task> tasks = new List<Task>();

        public void AddTask(string title)
        {
            tasks.Add(new Task { title = title });
        }

        public List<Task> GetTasks()
        {
            return tasks;
        }

        public void UpdateTasks()
        {
            RequestServices requestServices = new RequestServices();
            tasks = requestServices.GetAllTasks();
        }
    }
}
