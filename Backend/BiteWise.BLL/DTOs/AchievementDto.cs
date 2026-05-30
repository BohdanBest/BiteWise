using System;

namespace BiteWise.BLL.DTOs
{
    public class AchievementDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconName { get; set; } = string.Empty;
        public bool IsEarned { get; set; }
        public DateTime? EarnedAt { get; set; }
    }
}
