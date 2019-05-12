using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace client.Models
{
    public class EditRequest
    {
        public string editTask(object id, object propertyName)
        {
            EditTask editTask = new EditTask();
            editTask.id = id;
            editTask.propName = propertyName;
            editTask.value = true;
            if (editTask.value == null)
                editTask.value = true;
            if ((bool)editTask.value == true)
                editTask.value = false;
            if ((bool)editTask.value == false)
                editTask.value = true;
            return JsonConvert.SerializeObject(editTask);
        }
    }
}