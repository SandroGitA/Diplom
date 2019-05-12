using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace client.Models
{
    public class EditRequest
    {
        public string ChangeCompleteTask(object id, object isComplete)
        {
            EditTask editTask = new EditTask();
            editTask.id = id;
            editTask.propName = "isComplete";
            if ((bool)isComplete)
                editTask.value = false;
            else editTask.value = true;
            return JsonConvert.SerializeObject(editTask);
        }
    }
}