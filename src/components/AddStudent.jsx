import { useState } from "react";
import { databases } from "../appwrite/config";
import { ID } from "appwrite";
import conf from "../conf/conf";

export default function AddStudent({ onSuccess, userId }) {
    const [name, setName] = useState("");
    const [daysPerWeek, setDaysPerWeek] = useState(3);
    const [blockedDays, setBlockedDays] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Please enter a valid name");
            return;
        }

        setIsSubmitting(true);
        try {
            await databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteStudentCollectionId,
                ID.unique(),
                {
                    name: name.trim(),
                    daysPerWeek,
                    blockedDays: JSON.stringify(blockedDays),
                    tutorId: userId,
                }
            );
            setName("");
            setDaysPerWeek(3);
            setBlockedDays([]);
            onSuccess();
        } catch (error) {
            console.error("Error adding student:", error);
            alert(`Failed to add student: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleDay = (day) => {
        setBlockedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="card bg-base-100 shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Add New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                    <label className="label font-semibold">Student Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Nirob"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label font-semibold">Classes Per Week</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={daysPerWeek}
                            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                            className="range range-primary flex-1"
                        />
                        <span className="badge badge-primary badge-lg w-12 justify-center">
                            {daysPerWeek}
                        </span>
                    </div>
                </div>

                <div className="form-control">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Unavailable Days</span>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setShowDayPicker(!showDayPicker)}
                        >
                            {showDayPicker ? 'Hide' : 'Edit'} Days
                        </button>
                    </div>

                    {blockedDays.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {blockedDays.map((day) => (
                                <span key={day} className="badge badge-outline">
                                    {day}
                                </span>
                            ))}
                        </div>
                    )}

                    {showDayPicker && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {days.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    className={`btn btn-sm ${
                                        blockedDays.includes(day)
                                            ? 'btn-error text-white'
                                            : 'btn-outline'
                                    }`}
                                    onClick={() => toggleDay(day)}
                                >
                                    {day.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting || !name.trim()}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Student'}
                    </button>
                </div>
            </form>
        </div>
    );
}
