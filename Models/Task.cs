using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace client.Models
{
    public class Task
    {
        public object dateBind { get; set; }
        public object dateCreate { get; set; }
        public object descr { get; set; }
        public object id { get; set; }
        public object isComplete { get; set; }
        public object isPin { get; set; }
        public object title { get; set; }
    }
}
